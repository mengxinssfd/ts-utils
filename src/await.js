var __awaiter = function (thisArg, _arguments, P, generator) {
    return new Promise(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

Promise.resolve().then(
    () => {
        console.log(0);
        return Promise.resolve(4);
    }
).then(r => console.log(r));

Promise.resolve()
    .then(() => console.log(1))
    .then(() => console.log(2))
    .then(() => console.log(3))
    .then(() => console.log(5));


Promise.resolve().then(
    () => {
        console.log(0);
        const p = new Promise(resolve => resolve(4));
        p.then(() => console.log(6)).then(() => console.log(7))
        return p;
    }
).then(r => console.log(r));
Promise.resolve()
    .then(() => console.log(1))
    .then(() => console.log(2))
    .then(() => console.log(3))
    .then(() => console.log(5));
