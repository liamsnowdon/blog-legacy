const sharedConfig = {
  priority: '0.5',
  lastmod: false,
  getLoc(siteUrl, loc, entry) {
    return loc.replace(/\.\w+$/, '');
  }
}

export default {
  siteUrl: 'https://blog.liamsnowdon.uk',
  images: true,
  mappings: [
    {
      ...sharedConfig,
      pages: ['index.html'], // homepage
      changefreq: 'monthly',
      priority: '1.0'
    },
    {
      ...sharedConfig,
      pages: ['categories/index.html'], // categories page
      changefreq: 'yearly',
    },
    {
      ...sharedConfig,
      pages: ['tags/index.html'], // tags page
      changefreq: 'monthly',
    },
    {
      ...sharedConfig,
      pages: [
        'categories/*.html', // category pages
        '!categories/index.html', // not categories page
        'tags/*.html',  // tag pages
        '!tags/index.html',  // not tags page
      ],
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      ...sharedConfig,
      pages: ['posts/*.html'], // post pages
    }
  ]
};