# VRef

A minimal reactive library to track and respond to changes in variables, providing predictable, low-level reactivity.

---

### Usage

```ts
import ref from 'vref';

// Primitive value
const count = ref(0, (evt) => {
  console.log('Changed:', evt.value);
});

count.value = 1;
count.value++;

console.log(count.value); // 2

// Object value
const user = ref({ name: 'John', age: 25 }, (evt) => {
  console.log('Changed:', evt);
});

user.value.age = 26;     // triggers onchange
user.value.name = 'Doe'; // triggers onchange
```

---

Simple. Reactive. Proxy-powered.
