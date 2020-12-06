(function () {
    var PostCreator = {
        njkData: null,

        form: null,
        id: null,
        file: null,
        imageUrl: null,
        author: null,
        title: null,
        intro: null,
        datePosted: null,
        category: null,
        tags: null,
        relatedPosts: null,
        content: null,

        editForm: null,
        json: null,

        datePostedPicker: null,

        categoryChoices: [],
        categoryChoicesSelect: null,

        tagsChoices: [],
        tagsChoicesSelect: null,

        relatedPostsChoices: [],
        relatedPostsChoicesSelect: null,

        /**
         * Initialises the page.
         * 
         * @param {Object} njkData - Nunjucks data
         * @param {Array} njkData.tags
         * @param {Array} njkData.categories
         * @param {Array} njkData.posts
         * @param {number} njkData.newPostId
         */
        initialise: function (njkData) {
            this.form = document.querySelector('.js-post-creator-form');
            
            this.id = this.form.querySelector('.js-id');
            this.file = this.form.querySelector('.js-file');
            this.imageUrl = this.form.querySelector('.js-image-url');
            this.author = this.form.querySelector('.js-author');
            this.title = this.form.querySelector('.js-title');
            this.intro = this.form.querySelector('.js-intro');
            this.datePosted = this.form.querySelector('.js-date-posted');
            this.category = this.form.querySelector('.js-category');
            this.tags = this.form.querySelector('.js-tags');
            this.relatedPosts = this.form.querySelector('.js-related-posts');
            this.content = this.form.querySelector('.js-content');

            this.editForm = document.querySelector('.js-post-editor-form');
            this.json = this.editForm.querySelector('.js-json');

            this.datePostedPicker = new Pikaday({ 
                field: this.datePosted
            });

            this.processNjkData(njkData);

            // Set default author... Meeeee :)
            this.author.value = 'Liam Snowdon';

            this.initTinymce();
            this.initChoices();

            this.connectEvents();
        },

        /**
         * Initialises the tinyMCE editor for the content textarea
         */
        initTinymce: function () {
            tinymce.init({
                selector: '#content',
                height: 500,
                plugins: 'codesample code lists link image',
                toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | link | bullist numlist outdent indent | codesample code | image | removeformat',
                image_dimensions: false,
                image_prepend_url: '/assets/images/posts/'
            });
        },

        /**
         * Initialises the Choices plugin on select boxes
         */
        initChoices: function () {
            // Initialises the category Choices select box
            this.categoryChoicesSelect = new Choices('#category', {
                searchEnabled: false,
                choices: this.categoryChoices
            });

            // Initialises the tags Choices multiselect box
            this.tagsChoicesSelect = new Choices('#tags', {
                removeItemButton: true,
                placeholderValue: 'Add tags',
                choices: this.tagsChoices
            });

            this.relatedPostsChoicesSelect = new Choices('#related-posts', {
                removeItemButton: true,
                placeholderValue: 'Add related post',
                choices: this.relatedPostsChoices
            })
        },

        /**
         * Processes data from Nunjucks
         * 
         * @param {Object} njkData 
         * @param {Array} njkData.tags
         * @param {Array} njkData.categories
         * @param {Array} njkData.posts
         * @param {number} njkData.newPostId
         */
        processNjkData: function (njkData) {
            this.njkData = njkData;

            this.id.value = this.njkData.newPostId;
            
            this.categoryChoices = this.njkData.categories.map(function (category, index) {
                return {
                    value: index,
                    label: category
                };
            });

            this.tagsChoices = this.njkData.tags.map(function (tag, index) {
                return {
                    value: index,
                    label: tag
                };
            });

            this.relatedPostsChoices = this.njkData.posts.map(function (post, index) {
                return {
                    value: index,
                    label: post
                };
            });
        },

        /**
         * Attaches event listeners.
         */
        connectEvents: function () {
            this.form.addEventListener('submit', this.onFormSubmit.bind(this));
            this.editForm.addEventListener('submit', this.onEditFormSubmit.bind(this));
        },

        /**
         * Submits the form.
         * 
         * @param event 
         */
        onFormSubmit: function (event) {
            event.preventDefault();

            /*
            From tinyMCE docs:
            "Calls the save method on all editor instances in the collection. 
            This can be useful when a form is to be submitted."

            Effectively, it manually updates the <textarea> content to ensure
            it is ready for form submission.
            */
            tinymce.triggerSave();

            var data = JSON.stringify({
                id: this.id ? Number(this.id.value) : null,
                file: this.file ? this.file.value: null,
                imageUrl: this.imageUrl ? this.imageUrl.value : null,
                author: this.author ? this.author.value : null,
            
                title: this.title.value,
                intro: this.intro.value,
                datePosted: this.datePosted ? new Date(this.datePosted.value).toISOString() : null,
                category: Number(this.category.value),
                tags: Array.from(this.tags.selectedOptions).map(function (option) {
                    return Number(option.value);
                }),
                relatedPosts: Array.from(this.relatedPosts.selectedOptions).map(function (option) {
                    return Number(option.value);
                }),

                content: this.content.value
            });

            navigator.clipboard.writeText(data)
                .then(function () {
                    alert('JSON copied to clipboard.');
                }, function () {
                    alert('Error copying JSON to clipboard.');
                });
        },

        onEditFormSubmit: function (event) {
            event.preventDefault();

            var jsonData = this.json.value;

            if (!jsonData) {
                return;
            }

            try {
                jsonData = JSON.parse(jsonData);
            } catch (e) {
                alert('Error loading post data from JSON. Check console.');
                console.error(e);
                return;
            }

            this.id.value = jsonData.id | null;
            this.file.value = jsonData.file || null;
            this.imageUrl.value = jsonData.imageUrl || null;
            this.author.value = jsonData.author || null;
            this.title.value = jsonData.title || null;
            this.intro.value = jsonData.intro || null;
            
            if (jsonData.content) {
                tinymce.editors.content.setContent(jsonData.content)
            }

            if (jsonData.datePosted) {
                this.datePostedPicker.setDate(jsonData.datePosted);
            }
            
            if (typeof jsonData.category !== 'undefined') {
                this.categoryChoicesSelect.setChoiceByValue(jsonData.category);
            }

            if (jsonData.tags && jsonData.tags.length > 0) {
                this.tagsChoicesSelect.setChoiceByValue(jsonData.tags);
            }
            
            if (jsonData.relatedPosts && jsonData.relatedPosts.length > 0) {
                this.relatedPostsChoicesSelect.setChoiceByValue(jsonData.relatedPosts);
            }
        }
    };

    window.Blog = window.Blog || {};
    window.Blog.PostCreator = PostCreator;
})();