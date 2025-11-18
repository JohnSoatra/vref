# VRef

A tiny library to track variable's updates.
Designed to be **low-level** and **predictable**.

---

### Basic usage

```ts
import ref from 'vref';

const count = ref(0, e => console.log('Changed:', e.value));

count.value = 1;
count.value++;
console.log(count.value); // 2
```

```ts
const user = ref({ name: 'John', age: 25 }, e => console.log(e));

user.value.age = 26;     // reactive
user.value.name = 'Doe'; // reactive
```

---

Simple. Reactive. Proxy-powered.
