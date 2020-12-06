var PostCreator = (function () {
    return {
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
        content: null,

        datePostedPicker: null,

        categoryChoices: [],
        categoryChoicesSelect: null,

        tagsChoices: [],
        tagsChoicesSelect: null,

        /**
         * Initialises the page.
         * 
         * @param {Object} njkData - Nunjucks data
         * @param {Array} njkData.tags
         * @param {Array} njkData.categories
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

            this.content = this.form.querySelector('.js-content');


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
        },

        /**
         * Processes data from Nunjucks
         * 
         * @param {Object} njkData 
         * @param {Array} njkData.tags
         * @param {Array} njkData.categories
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
        },

        /**
         * Attaches event listeners.
         */
        connectEvents: function () {
            this.form.addEventListener('submit', this.onFormSubmit.bind(this));
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

                content: this.content.value
            });

            navigator.clipboard.writeText(data);
        }
    };
})();