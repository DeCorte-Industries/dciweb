# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Baked in at build time, same caveat as the main site: rebuild the
# image if these change.
ARG SANITY_STUDIO_PROJECT_ID=""
ARG SANITY_STUDIO_DATASET="production"
ENV SANITY_STUDIO_PROJECT_ID=$SANITY_STUDIO_PROJECT_ID \
    SANITY_STUDIO_DATASET=$SANITY_STUDIO_DATASET

RUN npx sanity build

# ---- Serve stage ----
FROM nginx:1.27-alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Same fix as the main site's Dockerfile — see comment there.
RUN chmod -R a+rX /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost/ || exit 1
