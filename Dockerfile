FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY crm.htpasswd /etc/nginx/crm.htpasswd
COPY index.html /usr/share/nginx/html/index.html
COPY assets/ /usr/share/nginx/html/assets/
COPY buoi-1/ /usr/share/nginx/html/buoi-1/
COPY buoi-2/ /usr/share/nginx/html/buoi-2/
COPY buoi-2/ /usr/share/nginx/html/buoi-2/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
