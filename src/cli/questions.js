const create = [
  {
    type: 'input',
    name: 'pack_name',
    message: 'New Pack name:',
    validate(value) {
      if (value === '') return 'Please specify a Pack name';
      return value.match(/^[a-z0-9_]*/i)
        ? true
        : 'Pack name must be letters, numbers or _';
    }
  },

  {
    type: 'input',
    name: 'image_repo',
    message: 'Docker image for this pack, e.g. myorg/myapp',
    validate(value) {
      return value.match(/^[a-z0-9-_:./@]*/i)
        ? true
        : 'Image contains invalid characters';
    }
  },

  {
    type: 'input',
    name: 'image_tag',
    message: 'Default tag for this image',
    validate(value) {
      return value.match(/^[a-z0-9-_/@]*/i) ? true : 'Tag contains invalid characters';
    }
  },

  {
    type: 'confirm',
    name: 'use_sync',
    message: 'Include Swarm-Sync configuration in this Pack?'
  },

  {
    type: 'input',
    name: 'tag_pattern',
    message: 'Swarm-sync tag pattern, e.g. semver:^1.1.1',
    when: answers => answers.use_sync
  },

  {
    type: 'number',
    name: 'default_port',
    message: 'Default port to expose (or none)',
    default: false
  }
];

module.exports = {
  create
};
