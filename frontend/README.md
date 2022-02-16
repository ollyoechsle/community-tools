# Frontend

## Web Components

### News Component
```
<ct-news></ct-news>
```

### Weather Component
```
<ct-weather location="location_id"></ct-weather>
```

### Bus Times Component
```
<ct-bus-times stops="stop1, stop2"></ct-weather>
```

## Running locally

```
npm run serve
```

Demos of the components can be viewed on the development server
(typically: localhost:8081)

# Developer Setup

Prerequisites:
* Node v16
* npm 8.5.0

This is deliberately based on Vue2, rather than Vue3, as Vue3 does not
yet have support for web components (as of February 2022)

The Vue CLI was installed as follows
```
npm install @vue/cli@3.12.1
```

## Building for production as web components

```
sh build-production-web-components.sh
```

This will build appropriate versions in the dist/ folder including a demo page.

## References

* https://medium.com/tunaiku-tech/your-first-web-component-with-vue-js-3386cffc0b1f