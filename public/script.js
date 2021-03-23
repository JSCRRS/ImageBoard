(() => {
    console.log("hola");

    new Vue({
        el: "#main",
        data: {
            news: "newest additions",
            title: "",
            description: "",
            username: "",
            file: null,
            images: [],
        },
        mounted: function () {
            // keine arrow-function, weil sonst this sich auf window bezieht (Kontext ändert sich)
            axios
                .get("/images")
                .then((response) => (this.images = response.data)); //this bezieht sich hier auf Vue
        },
        methods: {
            onSubmit: function () {
                console.log("ready for upload");
                const formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/images", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => this.images.push(response.detail));
            },
            onFileSelect: function () {
                this.file = this.$refs.image.files[0];
            },
        },
    });
})();
