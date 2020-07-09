# Geoawareness REST API

The REST API provides access to the Geoawareness data model and telemetry event ingest services.

## Backend Services

### Deploying

```
gcloud services enable servicemanagement.googleapis.com
gcloud services enable servicecontrol.googleapis.com
```

```
gcloud builds submit --tag gcr.io/$PROJECT_ID/geoawareness-backend --project $PROJECT_ID
gcloud run deploy geoawareness-backend --image gcr.io/$PROJECT_ID/geoawareness-backend --no-allow-unauthenticated --platform managed
```

## API

### Deploying

The instructions [here](https://cloud.google.com/endpoints/docs/openapi/get-started-cloud-run#configure_es) to deploy the ESP to Cloud Run have been compiled into a build script. Everytime you modify and redeploy the Endpoints service configuration, you must re-run this entire step. Otherwise, changes to the service configuration will not be propagated to ESPv2 Beta.

```
sh build/build-deploy-api.sh <hostname> # Example: api.geoawareness.woolpert.dev
```

#### Map Custom Domain

See these [instructions](https://cloud.google.com/run/docs/mapping-custom-domains#command-line) to map a custom domain to the 'host' value in the service definition file.
