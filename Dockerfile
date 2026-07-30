# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Sanity's PUBLIC_* vars are read by Vite at build time, so they must be
# passed as build args (a running container can't change them afterward —
# rebuild the image if these values change).
ARG PUBLIC_SANITY_PROJECT_ID=""
ARG PUBLIC_SANITY_DATASET="production"
ARG PUBLIC_SANITY_API_VERSION="2024-01-01"
ENV PUBLIC_SANITY_PROJECT_ID=$PUBLIC_SANITY_PROJECT_ID \
    PUBLIC_SANITY_DATASET=$PUBLIC_SANITY_DATASET \
    PUBLIC_SANITY_API_VERSION=$PUBLIC_SANITY_API_VERSION

RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine AS serve

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Files copied from the build context can carry restrictive source
# permissions (e.g. owner-only) that survive COPY unchanged. nginx's
# worker processes run as the unprivileged "nginx" user, not root, so
# without this they'd get "Permission denied" reading otherwise-valid
# files. -X only adds execute to directories (needed to traverse them),
# not to regular files.
RUN chmod -R a+rX /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost/ || exit 1
