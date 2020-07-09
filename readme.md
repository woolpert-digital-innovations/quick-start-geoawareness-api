# Geowareness REST API

REST API provides access to the Geoawareness data model and telemetry event ingest services.

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

Follow instructions [here](https://cloud.google.com/endpoints/docs/openapi/get-started-cloud-run#configure_es) to deploy the ESP to Cloud Run.

#### One-time

```
gcloud services enable endpoints.googleapis.com
```

Choose a host name for the API. Update 'host' tag in geoawareness-api (service definition file).

```
export CLOUD_RUN_HOSTNAME=<host name> # Example: api.geoawareness.woolpert.dev
gcloud endpoints services deploy geoawareness-api.yaml
gcloud services enable $CLOUD_RUN_HOSTNAME
```

#### Deploy a new ESPv2 Beta image

Everytime you modify and redeploy the Endpoints service configuration, you must re-run this entire step. Otherwise, changes to the service configuration will not be propagated to ESPv2 Beta.

```
# Cloud Endpoints Configuration ID. Example: 2020-07-07r0
export CONFIG_ID=<config id>

./build/gcloud_build_image -s $CLOUD_RUN_HOSTNAME -c $CONFIG_ID -p $PROJECT_ID
gcloud run deploy geoawareness-api \
  --image="gcr.io/$PROJECT_ID/endpoints-runtime-serverless:$CLOUD_RUN_HOSTNAME-$CONFIG_ID" \
  --set-env-vars=ESPv2_ARGS=--cors_preset=basic \
  --allow-unauthenticated \
  --platform managed \
  --project $PROJECT_ID
```

#### Map Custom Domain

See these [instructions](https://cloud.google.com/run/docs/mapping-custom-domains#command-line) to map a custom domain to the 'host' value in the service definition file.
