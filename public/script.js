(() => {
    Vue.component("modal", {
        template: "#modal",
        props: ["imageId"],
        data: function () {
            return {
                test: "its a trap",
                image: {},
            };
        },
        mounted: function () {
            console.log("[vue:modal] getting image info", this.imageId);
            /*  axios.get(`/images/${this.imageId}`).then((response) => {
                this.image = response.data;
            }); */
        },
    });

    new Vue({
        el: "#main",
        data: {
            news: "newest additions",
            title: "",
            description: "",
            username: "",
            file: null,
            images: [],
            clickedImage: null,
        },
        mounted: function () {
            // keine arrow-function, weil sonst this sich auf window bezieht (Kontext ändert sich)
            axios.get("/images").then((response) => {
                this.images = response.data;
            }); //this bezieht sich hier auf Vue
        },
        methods: {
            onImageClick: function (id) {
                //console.log(id);
                this.clickedImage = id;
                console.log(
                    "[vue:original] getting image info",
                    this.clickedImage
                );

                //console.log(this.clickedImage);
            },
            onSubmit: function () {
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
                    .then((response) => this.images.push(response.data));
            },
            onFileSelect: function () {
                this.file = this.$refs.image.files[0];
            },
        },
    });
})();
