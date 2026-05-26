# LibreBORME

- **URL:** https://github.com/PabloCastellano/libreborme
- **Categoría:** Backend / Open Data / España
- **¿Qué hace?:** Plataforma web (Django) para la consulta y el análisis del Boletín Oficial del Registro Mercantil (BORME) de España. Descarga diariamente los BORMEs en formato PDF desde el BOE, los parsea usando la librería [bormeparser](https://github.com/PabloCastellano/bormeparser), y almacena en PostgreSQL los datos estructurados de empresas, personas y cargos. La búsqueda semántica se realiza sobre Elasticsearch. Nota: el repositorio está desmantelado pero se mantiene online como referencia de código. Existe una versión comercial en [librebor.me](https://libreborme.me) con API.
- **Casos de uso:**
  - Consultar información registral de empresas españolas (nombre, NIF, tipo, estado activo/extinguida, cargos actuales e historial)
  - Investigar el historial de cargos de una persona física en empresas
  - Búsqueda semántica de empresas y personas en el registro mercantil
  - Analizar cambios en el registro merciliar por fecha, provincia o sección
  - Exportar datos de cargos en formato CSV
  - Scraping y análisis de open data del sector empresarial español
  - Referencia de arquitectura para proyectos de parsing de documentos oficiales
- **Snippets útiles:**

  **Modelo Company con tracking de cargos y búsqueda Elasticsearch:**
  ```python
  # borme/models.py - Modelo Company con campos JSON para cargos
  class Company(m.Model):
      name = m.CharField(max_length=260, db_index=True)
      nif = m.CharField(max_length=10)
      slug = m.SlugField(max_length=260, primary_key=True)
      date_creation = m.DateField(blank=True, null=True)
      date_extinction = m.DateField(blank=True, null=True)
      is_active = m.BooleanField(default=True)
      type = m.CharField(max_length=50)  # SL, SA, SCL, COOP...

      # Cargos actuales y historial como JSONField
      cargos_actuales_p = JSONField(default=list)  # personas
      cargos_actuales_c = JSONField(default=list)  # empresas
      cargos_historial_p = JSONField(default=list)
      cargos_historial_c = JSONField(default=list)

      # Campo de búsqueda full-text para Elasticsearch
      document = SearchVectorField(null=True, db_index=True)

      def update_cargos_entrantes(self, cargos):
          for cargo in cargos:
              cargo_embed = cargo.copy()
              cargo_embed.pop('type', None)
              if cargo['type'] == 'company':
                  self.cargos_actuales_c.append(cargo_embed)
              else:
                  self.cargos_actuales_p.append(cargo_embed)

      def update_cargos_salientes(self, cargos):
          for cargo in cargos:
              cargo_embed = cargo.copy()
              cargo_embed.pop('type', None)
              # Mover de actuales a historial
              if cargo['type'] == 'company':
                  for cargo_a in self.cargos_actuales_c:
                      if all(cargo[k] == cargo_a[k] for k in ('name', 'title')):
                          self.cargos_actuales_c.remove(cargo_a)
                          cargo_embed['date_from'] = cargo_a['date_from']
                          break
                  self.cargos_historial_c.append(cargo_embed)
              else:
                  for cargo_a in self.cargos_actuales_p:
                      if all(cargo[k] == cargo_a[k] for k in ('name', 'title')):
                          self.cargos_actuales_p.remove(cargo_a)
                          cargo_embed['date_from'] = cargo_a['date_from']
                          break
                  self.cargos_historial_p.append(cargo_embed)
  ```

  **Mixin de caché para vistas Django:**
  ```python
  # borme/mixins.py - CacheMixin reutilizable
  from django.views.decorators.cache import cache_page

  class CacheMixin(object):
      cache_timeout = 3600

      def get_cache_timeout(self):
          return self.cache_timeout

      def dispatch(self, *args, **kwargs):
          return cache_page(self.get_cache_timeout())(
              super(CacheMixin, self).dispatch
          )(*args, **kwargs)
  ```

  **API REST con TastyPie + Elasticsearch:**
  ```python
  # borme/api/resources.py - Resource con búsqueda via ES
  from tastypie.resources import ModelResource
  from tastypie.throttle import CacheThrottle

  class CompanyResource(ModelResource):
      class Meta:
          excludes = ['document', 'nif']
          detail_allowed_methods = ['get']
          list_allowed_methods = []
          max_limit = 100
          queryset = Company.objects.all()
          resource_name = 'empresa'
          throttle = CacheThrottle(throttle_at=60, timeframe=3600)

      def get_search(self, request, **kwargs):
          query = request.GET.get('q', '')
          if len(query) > 3:
              sqs = es_search_paginator('company_document', query)
              paginator = Paginator(sqs, 20)
              page = paginator.page(int(request.GET.get('page', 1)))
              slugs = list(map(lambda x: x['_source']['slug'], page))
              object_list = Company.objects.filter(slug__in=slugs)
              objects = []
              for result in object_list:
                  bundle = self.build_bundle(obj=result, request=request)
                  bundle = self.search_dehydrate(bundle)
                  objects.append(bundle)
              return self.create_response(request, {'objects': objects})
  ```

  **Elasticsearch DSL integration para búsqueda full-text:**
  ```python
  # borme/documents.py - Configuración de índices ES con Django
  from django_elasticsearch_dsl import DocType, fields, Index
  from elasticsearch_dsl import analyzer, token_filter

  idx = Index('libreborme')

  @idx.doc_type
  class CompanyDocument(DocType):
      name = fields.TextField(attr="fullname")
      class Meta:
          model = Company
          fields = ['slug']

  @idx.doc_type
  class PersonDocument(DocType):
      class Meta:
          model = Person
          fields = ['name', 'slug']
  ```

  **Funciones helper get_or_create para entidades:**
  ```python
  # borme/models.py - Patrón get_or_create reutilizable
  def company_get_or_create(empresa, tipo, slug_c):
      try:
          company = Company.objects.get(slug=slug_c)
          created = False
      except Company.DoesNotExist:
          company = Company(name=empresa, type=tipo)
          created = True
      return company, created

  def person_get_or_create(nombre):
      try:
          slug_p = slugify(nombre)
          person = Person.objects.get(slug=slug_p)
          created = False
      except Person.DoesNotExist:
          person = Person(name=nombre)
          created = True
      return person, created
  ```

  **Exportación CSV de cargos (vista Django):**
  ```python
  # borme/views.py - Generación de CSV con cache
  from django.http import HttpResponse
  from django.views.decorators.cache import cache_page
  import csv, datetime

  @cache_page(3600)
  def generate_company_csv_cargos_actual(context, slug):
      company = Company.objects.get(slug=slug)
      filename = 'cargos_actuales_%s_%s' % (slug, datetime.date.today().isoformat())
      response = HttpResponse(content_type='text/csv')
      response['Content-Disposition'] = 'attachment; filename="%s.csv"' % filename
      writer = csv.writer(response)
      writer.writerow(['Cargo', 'Nombre', 'Desde', 'Hasta', 'Tipo'])
      for cargo in company.get_cargos_actuales(limit=0)[0]:
          name = cargo['name'] if cargo['type'] == 'company' else cargo['name'].title()
          writer.writerow([cargo['title'], name, cargo['date_from'], '', cargo['type']])
      return response
  ```

  **Importación masiva de PDFs del BORME:**
  ```python
  # borme/parser/importer.py - Pipeline de importación
  import bormeparser
  from bormeparser.borme import BormeXML

  # Descargar y parsear un BORME PDF
  borme = bormeparser.parse(filepath, bormeparser.SECCION.A)

  # Iterar sobre anuncios y actos
  for anuncio in borme.get_anuncios():
      for acto in anuncio.get_borme_actos():
          if isinstance(acto, bormeparser.borme.BormeActoCargo):
              for nombre_cargo, nombres in acto.cargos.items():
                  for nombre in nombres:
                      # Procesar cargo (persona o empresa)
                      pass

  # Guardar como JSON intermedio
  borme.to_json('/ruta/archivo.json')
  ```

- **Cómo integrarlo en proyectos:**
  1. **Stack tecnológico:** Django 2.0+, PostgreSQL 9.5+, Elasticsearch 5.6+, Python 3.x
  2. **Dependencias clave:** `bormeparser` (parsea PDFs/XML del BOE), `django-tastypie` (API REST), `django-elasticsearch-dsl` (búsqueda full-text), `psycopg2-binary`
  3. **Arquitectura de datos:** Los PDFs del BORME se descargan del BOE → se parsean con `bormeparser` → se convierten a JSON intermedio → se importan a PostgreSQL como entidades (Borme, Company, Person, Anuncio) → se indexan en Elasticsearch para búsqueda
  4. **Comandos de Django útiles:**
     - `python manage.py importborme -- --init` : Importa todos los BORMEs desde 2009
     - `python manage.py importbormetoday` : Importa los BORMEs del día (para cron)
     - `python manage.py importbormepdf <archivo.pdf>` : Importa un PDF específico
     - `python manage.py importbormejson <archivo.json>` : Importa un JSON específico
     - `python manage.py findcompany <nombre>` / `findperson <nombre>` : Búsqueda CLI
  5. **API REST:** Endpoint en `/api/v1/` con recursos `empresa` y `persona`. Búsqueda: `GET /api/v1/empresa/search/?q=query&page=1`. Detalle: `GET /api/v1/empresa/<slug>/`
  6. **Docker:** `docker-compose.yml` incluye PostgreSQL y Elasticsearch. La app Django está comentada (hay que construirla con `docker/Dockerfile`)
  7. **Consideraciones:** El proyecto usa Django 2.0 (desactualizado). Para un proyecto moderno, migrar a Django 4+/5+, considerar Django REST Framework en lugar de TastyPie, y actualizar Elasticsearch a versiones 7+/8+. El parser `bormeparser` es el componente más valioso reutilizable independientemente del framework web.
  8. **Patrones reutilizables:** El patrón `get_or_create` con slugs, el manejo de cargos actuales/historial con JSONFields, la integración ES+Django con `django-elasticsearch-dsl`, y el pipeline de descarga→parseo→importación son patrones aplicables a otros proyectos de open data gubernamental.
- **Fecha de aprendizaje:** 2026-05-26
