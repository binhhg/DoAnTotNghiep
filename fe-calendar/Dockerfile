FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn

#ENV REACT_APP_GOOGLE_CLIENT_ID="925232483768-fs45c8obk5mefufo6ob5tl20mdjrb35q.apps.googleusercontent.com"
#ENV NEXT_PUBLIC_API_URL="https://api.trotot.online"
#ENV NEXT_PUBLIC_COOKIE_ACCESS_TOKEN_KEY="cookie_access_token_key"
#ENV NEXT_PUBLIC_COOKIE_REFRESH_ACCESS_TOKEN_KEY="cookie_refresh_access_token_key"
#ENV NEXT_PUBLIC_SESSION_ID="cookie_session_id"

EXPOSE 3000
RUN yarn build
CMD ["yarn", "start"]
