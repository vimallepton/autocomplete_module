"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Addressinput = Addressinput;
exports.Companyname = Companyname;

var _react = _interopRequireWildcard(require("react"));

require("./index.css");

var _core = require("@material-ui/core");

var _reactGoogleAutocomplete = require("react-google-autocomplete");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Companyname(props) {
  const [search, setSearch] = (0, _react.useState)('');

  const searchInput = _react.default.useRef(null);

  const [test, setTest] = (0, _react.useState)("");
  const [showAutoComplete, setShowAutoComplete] = (0, _react.useState)(false);

  const debounce = func => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 100);
    };
  };

  const handleChangeInSearch = event => {
    const {
      value
    } = event.target;
    setTest(value);

    if (value !== '') {
      fetch(`http://14.98.61.195:9962/lepton/companyname?name=${value}`).then(res => res.json()).then(json => setSearch(json.data.name));
    } else {
      setShowAutoComplete(false);
    }
  };

  const optimiseVersion = (0, _react.useCallback)(() => {
    debounce(handleChangeInSearch);
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      minWidth: props.minWidth,
      margin: 0,
      backgroundColor: props.backgroundColor,
      borderWidth: props.borderWidth,
      borderColor: props.borderColor,
      borderRadius: props.borderRadius,
      fontFamily: props.fontFamily,
      fontColor: props.fontColor
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Grid, {
    item: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/_react.default.createElement(_core.TextField, {
    ref: searchInput,
    style: {
      width: '100%'
    },
    id: "nameid",
    label: "Name",
    variant: "outlined",
    type: "text",
    name: "search",
    placeholder: "name",
    className: "search",
    value: test,
    onChange: e => {
      setShowAutoComplete(true);
      setTest(e.target.value);
      optimiseVersion(e);
    }
  }), (search === null || search === void 0 ? void 0 : search.length) > 0 && showAutoComplete ? /*#__PURE__*/_react.default.createElement("div", {
    className: 'autocomplete'
  }, search === null || search === void 0 ? void 0 : search.map((el, i) => /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      textAlign: ''
    },
    key: i,
    className: 'autocompletename'
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      textAlign: 'left'
    },
    onClick: () => {
      props.parentCallback(el.company_name);
      setTest(el.company_name);
      setShowAutoComplete(false);
    }
  }, el.company_name)))) : " ")));
} // google autocomplete..


function Addressinput(props) {
  const [searching, setSearching] = (0, _react.useState)(``);
  (0, _react.useEffect)(() => {
    setSearching(props.searchval);
  }, [props.searchval]);

  const setAddressDetails = (place, type) => {
    const formattedAddress = place.formatted_address;
    setSearching(formattedAddress);
  };

  const {
    ref: addressRef
  } = (0, _reactGoogleAutocomplete.usePlacesWidget)({
    apiKey: `${props.apikey}`,
    onPlaceSelected: place => setAddressDetails(place, 'locality'),
    options: {
      fields: ["address_components", "formatted_address", "geometry", "name"],
      types: [],
      componentRestrictions: {
        country: "in"
      }
    },
    placeholder: "Pincode"
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      minWidth: props.minWidth,
      margin: 0,
      backgroundColor: props.backgroundColor,
      borderWidth: props.borderWidth,
      borderColor: props.borderColor,
      borderRadius: props.borderRadius,
      fontFamily: props.fontFamily,
      fontColor: props.fontColor
    }
  }, /*#__PURE__*/_react.default.createElement(_core.TextField, {
    id: "localityid",
    inputRef: addressRef,
    value: searching,
    onChange: e => {
      setSearching(e.target.value);
    },
    label: "Address",
    variant: "outlined",
    style: {
      width: '100%',
      color: 'white'
    }
  }));
}