(function () {
    console.log("hola");

    new Vue({
        el: "#main",
        data: {
            title: "imageboard",
            news: "newest additions",
            images: [],
        },
        mounted: function () {
            axios.get("/images").then((response) => {
                console.log(response);
                console.log("this", this);
                this.images = response.data;
            });
        },
    });
})();
