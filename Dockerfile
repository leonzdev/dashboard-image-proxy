FROM node:lts as BUILDER

WORKDIR /app
COPY . .
RUN rm -f .env* \
  && rm -rf .next \
  && rm -rf node_modules \
  && rm -f next-env.d.ts

# Set some environment variables to make next build happy
ENV DASH_URL="http://localhost:8000"
ENV AUTH_HEADER_KEY=AUTHORIZATION
ENV AUTH_HEADER_VALUE="DUMMY"
ENV HEADLESS=false
ENV RELOAD=false

RUN npm ci
RUN npm run build

FROM ghcr.io/puppeteer/puppeteer:22.7.1 as RUNNER
WORKDIR /app
COPY --from=BUILDER /app /app

ENV NODE_ENV=production

EXPOSE 3000

CMD HOSTNAME="0.0.0.0" npm run start