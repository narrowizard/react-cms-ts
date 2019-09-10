import "babel-polyfill";
import dva from "dva";
import { createBrowserHistory } from "history";
import "raf/polyfill";

Object.setPrototypeOf = require("setprototypeof");

const history = createBrowserHistory();

const app = dva({
    history,
    onError: (e) => {
        console.error(e.message);
    },
});

// app.model(home);

app.router(require("./router").default);

app.start("#root");
