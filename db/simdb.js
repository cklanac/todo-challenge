'use strict';

const simDB = {

  create: function () {
    function fn(newItem) {
      newItem.id = this.nextVal++;
      this.data.push(newItem); // unshift for nice display (not performance)
      return newItem;
    }
    return invoke(fn.bind(this), arguments);
  },

  find: function () {
    function fn(query = {}) {
      let list = this.data.filter(item => Object.keys(query).every(key => item[key] === query[key]));
      return list;
    }
    return invoke(fn.bind(this), arguments);
  },

  findById: function () {
    function fn(id) {
      id = Number(id);
      let item = this.data.find(item => item.id === id);
      return item;
    }
    return invoke(fn.bind(this), arguments);
  },

  findByIdAndReplace: function () {
    function fn(id, replaceItem) {
      id = Number(id);
      const index = this.data.findIndex(item => item.id === id);
      if (index === -1) {
        return null;
      }
      replaceItem.id = id;
      this.data.splice(index, 1, replaceItem);
      return replaceItem;
    }
    return invoke(fn.bind(this), arguments);
  },

  findByIdAndUpdate: function () {
    function fn(id, updateItem) {
      id = Number(id);
      let item = this.data.find(item => item.id === id);
      if (!item) {
        return null;
      }
      Object.assign(item, updateItem);
      return item;
    }
    return invoke(fn.bind(this), arguments);
  },

  findByIdAndRemove: function () {
    function fn(id) {
      id = Number(id);
      const index = this.data.findIndex(item => item.id === id);
      if (index === -1) {
        return null;
      } else {
        return this.data.splice(index, 1).length;
      }
    }
    return invoke(fn.bind(this), arguments);
  },

  initialize: function () {
    function fn(data) {
      this.nextVal = 1000;
      this.data = data.map(item => {
        item.id = this.nextVal++;
        return item;
      });
      return this;
    }
    return invoke(fn.bind(this), arguments);
  },

  destroy: function () {
    function fn() {
      this.nextVal = 1000;
      this.data = [];
      return this;
    }
    return invoke(fn.bind(this), arguments);
  }
};
function invoke(fn, args) {
  const callback = args[args.length - 1];

  if (typeof callback === 'function') {
    setImmediate(() => {
      try {
        const result = fn(...args);
        callback(null, result);
      } catch (err) {
        callback(err);
      }
    });
  } else {
    return new Promise((resolve, reject) => {
      setImmediate(() => {
        try {
          const result = fn(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

module.exports = Object.create(simDB);
