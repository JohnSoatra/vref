# VRef

A Tiny Reactive library to track and respond to changes in variables, providing predictable low-level reactivity.

---

### Usage

```ts
import ref from "vref";

// Primitive value
const count = ref(0, (evt) => {
  console.log("Changed:", evt.value);
});

count.value = 1;
count.value++;

console.log(count.value); // 2

// Object value
const { value: user } = ref({ name: "John", age: 25 }, (evt) => {
  console.log("Changed:", evt);
});

user.name = "Doe"; // triggers onchange
user.age += 1; // triggers onchange

console.log(user); // { name: "Doe", age: 26 }
```

---

Low-Level. Simple. Reactive.
