import { PID, Tuple, Integer, Float } from './primitives';
import BitString from './bit_string';
import Patterns from './patterns';

function call_property(item, property){
  if(property in item){
    item[property];
    if(item[property] instanceof Function){
      return item[property]();
    }else{
      return item[property];
    }

  }else if(Symbol.for(property) in item){
    let prop = Symbol.for(property)
    if(item[prop] instanceof Function){
      return item[prop]();
    }else{
      return item[prop];
    }
  }

  throw new Error(`Property ${property} not found in ${item}`);
}

function get_type(x){
  return typeof x;
}

function is_instance_of(x, type){
  return x instanceof type;
}

function apply(...args){
  if(args.length === 2){
    args[0].apply(null, args.slice(1));
  }else{
    args[0][args[1]].apply(null, args.slice(2));
  }
}

function contains(left, right){
  for(let x of right){
    if(Patterns.match_no_throw(left, x) != null){
      return true;
    }
  }

  return false;
}

function get_global(){
  if(typeof(self) !== "undefined"){
    return self;
  }else if(typeof(window) !== "undefined"){
    return window;
  }else if(typeof(global) !== "undefined"){
    return global;
  }

  throw new Error("No global state found");
}

function defstruct(defaults){
  return class {
    constructor(update = {}){
      let the_values = Object.assign(defaults, update);
      Object.assign(this, the_values);
    }

    static create(updates = {}){
      let x = new this(updates);
      return Object.freeze(x);
    }
  }
}


function defexception(defaults){
  return class extends Error {
    constructor(update = {}){
      let message = update.message || "";
      super(message);

      let the_values = Object.assign(defaults, update);
      Object.assign(this, the_values);

      this.name = this.constructor.name;
      this.message = message;
      this[SpecialForms.atom("__exception__")] = true;
      Error.captureStackTrace(this, this.constructor.name);
    }

    static create(updates = {}){
      let x = new this(updates);
      return Object.freeze(x);
    }
  }
}

function defprotocol(spec){
  return new Protocol(spec);
}

function defimpl(protocol, type, impl){
  protocol.implementation(type, impl);
}

function get_object_keys(obj){
  return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj))
}

function is_valid_character(codepoint){
  try{
    return String.fromCodePoint(codepoint) != null;
  }catch(e){
    return false;
  }
}

//https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Solution_2_%E2%80%93_rewrite_the_DOMs_atob()_and_btoa()_using_JavaScript's_TypedArrays_and_UTF-8
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function delete_property_from_map(map, property){
  let new_map = Object.assign(Object.create(map.constructor.prototype), map)
  delete new_map[property]

  return Object.freeze(new_map);
}

function class_to_obj(map){
  let new_map = Object.assign({}, map)
  return Object.freeze(new_map);
}

function add_property_to_map(map, property, value){
  let new_map = Object.assign({}, map);
  new_map[property] = value;
  return Object.freeze(new_map);
}

function bnot(expr){
  return ~expr;
}

function band(left, right){
  return left & right;
}

function bor(left, right){
  return left | right;
}

function bsl(left, right){
  return left << right;
}

function bsr(left, right){
  return left >> right;
}

function bxor(left, right){
  return left ^ right;
}

function zip(list_of_lists){
  if(list_of_lists.length === 0){
    return Object.freeze([]);
  }

  let new_value = [];
  let smallest_length = list_of_lists[0];

  for(let x of list_of_lists){
    if(x.length < smallest_length){
      smallest_length = x.length;
    }
  }

  for(let i = 0; i < smallest_length; i++){
    let current_value = [];
    for(let j = 0; j < list_of_lists.length; j++){
      current_value.push(list_of_lists[j][i]);
    }

    new_value.push(new Tuple(...current_value));
  }

  return Object.freeze(new_value);
}

function can_decode64(data) {
  try{
    atob(data);
    return true;
  }catch(e){
    return false;
  }
}

export default {
  call_property,
  apply,
  contains,
  get_global,
  defstruct,
  defexception,
  defprotocol,
  defimpl,
  get_object_keys,
  is_valid_character,
  b64EncodeUnicode,
  delete_property_from_map,
  add_property_to_map,
  class_to_obj,
  can_decode64,
  bnot,
  band,
  bor,
  bsl,
  bsr,
  bxor,
  zip
};
