<!-- DO NOT REMOVE - contributor_list:data:start:["Borrus-sudo", "dependabot[bot]"]:end -->

<h2 align="center">unplugin-add-deps</h2>

<p align="center">
Automatically constructs the dependencies hook array for your (p)react hooks based on the dependencies used in the callback!
</p>

[![All Contributors](https://img.shields.io/github/contributors/Borrus-sudo/unplugin-add-deps?color=orange)](#contributors-)
![License](https://img.shields.io/github/license/Borrus-sudo/unplugin-add-deps?label=License)
![Last Commit](https://img.shields.io/github/last-commit/Borrus-sudo/unplugin-add-deps?label=Last%20Commit)
![Stars](https://img.shields.io/github/stars/Borrus-sudo/unplugin-add-deps)
![Forks](https://img.shields.io/github/forks/Borrus-sudo/unplugin-add-deps)

## 🎩 Features

- Available as a ready-to-use vite, rollup, esbuild, webpack or a babel plugin!
- Constructs [] hooks at build time automatically!

## 💽 Installation

`pnpm i unplugin-add-deps`

## 🔮 Usage

```js
import { vite, rollup, webpack, babel, esbuild } from "unplugin-add-deps";

//vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vite } from "unplugin-add-deps";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vite(), react()],
});
```

## ⁉ FAQ

- ### Q. How to prevent adding deps to hooks?
  ### A. By using a leading comment to the hook `/*ignore*/`
  ```js
  /*ignore*/ useEffect(() => {}, []);
  ```
- ### Q. Why does it not add deps to hook without the leading comment?
  ### A. It is necessary to pass the blank deps array to the hook. This also prevents from ts getting mad at you!
  ```js
  let [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
  }, []);
  //  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
  let [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
  }, [count]);
  ```
- ### Q. How about props?

  ### A. It is necessary to follow the destructure pattern for the props for the plugin to pick those as deps

  ```jsx
  // Right way ✅
  function App({ hello }) {
    useEffect(() => {
      console.log(hello);
    }, []);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
  //  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
  function App({ hello }) {
    useEffect(() => {
      console.log(hello);
    }, [hello]);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }

  /* Wrong Way ❎*/
  function App({ hello }) {
    useEffect(() => {
      console.log(hello);
    }, []);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
  ```

## 🎉 Contributing

Contributions are welcome! Whether it is a small documentation change or a breaking feature, we welcome it!

_Please note: All contributions are taken under the MIT license_

<!-- prettier-ignore-start -->
<!-- DO NOT REMOVE - contributor_list:start -->
## 👥 Contributors


- **[@Borrus-sudo](https://github.com/Borrus-sudo)**

- **[@dependabot[bot]](https://github.com/apps/dependabot)**

<!-- DO NOT REMOVE - contributor_list:end -->
<!-- prettier-ignore-end -->
