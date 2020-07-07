## Backend Services

### Deploying

```
gcloud builds submit --tag gcr.io/$PROJECT_ID/geoawareness-backend --project $PROJECT_ID
gcloud run deploy geoawareness-backend --image gcr.io/$PROJECT_ID/geoawareness-backend --allow-unauthenticated --platform-managed
gcloud services enable servicemanagement.googleapis.com
gcloud services enable servicecontrol.googleapis.com
```

## API

### Deployment

https://cloud.google.com/endpoints/docs/openapi/get-started-cloud-run#configure_esp

#### One-time

```
gcloud services enable endpoints.googleapis.com
```

```
gcloud run deploy geoawareness-api --image="gcr.io/endpoints-release/endpoints-runtime-serverless:2" --allow-unauthenticated --platform managed
gcloud endpoints services deploy geoawareness-api.yaml
```

#### Deploy a new ESPv2 Beta image

Everytime you modify and redeploy the Endpoints service configuration, you must re-run this entire step. Otherwise, changes to the service configuration will not be propagated to ESPv2 Beta.

```
# Host name as specified in service definition file host. Example: geoawareness-api-bkejaovq4a-uw.a.run.app
export CLOUD_RUN_HOSTNAME=<host name>
gcloud services enable $CLOUD_RUN_HOSTNAME

# Cloud Endpoints Configuration ID. Example: 2020-07-07r0
export CONFIG_ID=<config id>
```

Rebuild new image and deploy.

```
./gcloud_build_image -s $CLOUD_RUN_HOSTNAME -c $CONFIG_ID -p $PROJECT_ID
gcloud run deploy geoawareness-api \
  --image="gcr.io/$PROJECT_ID/endpoints-runtime-serverless:$CLOUD_RUN_HOSTNAME-$CONFIG_ID" \
  --set-env-vars=ESPv2_ARGS=--cors_preset=basic \
  --allow-unauthenticated \
  --platform managed \
  --project $PROJECT_ID
```
