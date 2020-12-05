var PostCreator = (function () {
    return {
        form: null,
        title: null,
        intro: null,
        category: null,
        tags: null,
        content: null,

        id: null,
        datePosted: null,
        imageUrl: null,

        categoryChoicesSelect: null,
        tagsChoicesSelect: null,

        /**
         * Initialises the page.
         */
        initialise: function () {
            this.form = document.querySelector('.js-post-creator-form');
            this.title = this.form.querySelector('.js-title');
            this.intro = this.form.querySelector('.js-intro');
            this.category = this.form.querySelector('.js-category');
            this.tags = this.form.querySelector('.js-tags');
            this.content = this.form.querySelector('.js-content');

            this.id = this.form.querySelector('.js-id');
            this.datePosted = this.form.querySelector('.js-date-posted');
            this.imageUrl = this.form.querySelector('.js-image-url');

            // Initialises the tinyMCE editor for the content textarea
            tinymce.init({
                selector: '#content',
                height: 500,
                plugins: 'codesample code lists link',
                toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | link | bullist numlist outdent indent | codesample code | removeformat'
            });

            // Initialises the category Choices select box
            this.categoryChoicesSelect = new Choices('#category', {
                searchEnabled: false,
                choices: [
                    { value: 'HTML', label: 'HTML' },
                    { value: 'CSS', label: 'CSS' },
                    { value: 'JavaScript', label: 'JavaScript' }
                ]
            });

            // Initialises the tags Choices multiselect box
            this.tagsChoicesSelect = new Choices('#tags', {
                removeItemButton: true,
                placeholderValue: 'Add tags',
                choices: [
                    { value: 'accessiblility', label: 'Accessibility' },
                    { value: 'forms', label: 'Forms' }
                ]
            });

            this.connectEvents();
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

            var data = {
                id: this.id ? this.id.value : null,
                datePosted: this.datePosted ? this.datePosted.value : null,
                imageUrl: this.imageUrl ? this.imageUrl.value : null,

                title: this.title.value,
                intro: this.intro.value,
                category: this.category.value,
                tags: Array.from(this.tags.selectedOptions).map(function (option) {
                    return option.value;
                }),
                content: this.content.value,
            };

            console.log(data);
        }
    };
})();