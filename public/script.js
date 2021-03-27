(() => {
    Vue.component("modal", {
        template: "#modal",
        props: ["imageId"],
        data: function () {
            return {
                image: {},
            };
        },
        mounted: function () {
            //console.log("[vue:modal] getting image id:", this.imageId);
            axios.get(`/images/${this.imageId}`).then((response) => {
                this.image = response.data[0];
            });
        },
        methods: {
            onButtonClick: function () {
                this.$emit("click");
            },
        },
    });

    Vue.component("comments", {
        template: "#comments",
        props: ["imageId"],
        data: function () {
            return {
                comments: [],
                text: "",
                username: "",
            };
        },
        mounted: function () {
            /*             console.log("[vue:comments] getting image id:", this.imageId);
             */
            axios.get(`/images/${this.imageId}/comments`).then((response) => {
                //console.log("[vue:comments] getting response:", response.data);
                this.comments = response.data;
            });
        },
        methods: {
            onSubmit: function () {
                axios
                    .post(`/images/${this.imageId}/comments`, {
                        username: this.username,
                        text: this.text,
                        imageId: this.imageId,
                    })
                    .then((response) => {
                        this.comments.push(response.data);
                        /*       console.log(
                            "[vue:comments], pushing comments:",
                            response.data
                        ); */
                        this.username = "";
                        this.text = "";
                    });
            },
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
            lastImageID: null,
            IMG_LIMIT: 3,
            imagesAvailable: true,
        },
        mounted: function () {
            // keine arrow-function, weil sonst this sich auf window bezieht (Kontext ändert sich)
            axios.get("/images").then((response) => {
                this.images = response.data;
                this.lastImageID = response.data[response.data.length - 1].id;
            }); //this bezieht sich hier auf Vue
        },
        methods: {
            onImageClick: function (id) {
                //console.log(id);
                this.clickedImage = id;
                /* console.log(
                    "[vue:original] getting image id:",
                    this.clickedImage
                ); */

                //console.log(this.clickedImage);
            },
            closeImageBox: function () {
                this.clickedImage = null;
            },

            onMoreImagesClick: function () {
                this.getMoreImages();
            },

            getMoreImages: function () {
                axios
                    .get("/images", {
                        params: {
                            last_id: this.lastImageID,
                            limit: this.IMG_LIMIT,
                        },
                    })
                    .then((response) => {
                        /*                         console.log(
                            "[vue:original] this lastImageID:",
                            this.lastImageID
                        );
                        console.log("[vue:original] this.images:", this.images);
                        console.log(
                            "[vue:original] response.data:",
                            response.data,
                            response.data.length,
                            response.data[response.data.length - 1].id
                        ); */
                        this.images = [...this.images, ...response.data];
                        this.lastImageID =
                            response.data[response.data.length - 1].id;

                        if (
                            response.data.length !== this.IMG_LIMIT ||
                            this.lastImageID === 1
                        ) {
                            this.imagesAvailable = false;
                        }
                    });
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
