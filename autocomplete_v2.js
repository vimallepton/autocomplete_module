"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Addressinput = Addressinput;
exports.Companyname = Companyname;

require("./index.css");

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Addressinput(props) {
  const activeRef = (0, _react.useRef)();
  const testRef = (0, _react.useRef)();
  const clickRef = (0, _react.useRef)();
  const focusRef = (0, _react.useRef)();
  const inputTag = (0, _react.useRef)();
  const inactiveTestRef = (0, _react.useRef)();
  const [value, setValue] = (0, _react.useState)("");
  const [showHideList, setShowHideList] = (0, _react.useState)(true);
  const [address, setAddress] = (0, _react.useState)("");
  const [a, setA] = (0, _react.useState)("");
  const [newAddresses, setNewAddresses] = (0, _react.useState)();
  const [cursor, setCursor] = (0, _react.useState)(-1);
  const [clickedOutside, setClickedOutside] = (0, _react.useState)(false);
  const [width, setWidth] = (0, _react.useState)(null);
  const [placePredictions, setPlacePredictions] = (0, _react.useState)([]);
  const [checker, setChecker] = (0, _react.useState)('');

  const getPlacePredictions = data => {
    fetch(`https://api.leptonsoftware.com:9962/lepton/getplacepredication?input=${data.input}`).then(res => res.json()).then(json => {
      setPlacePredictions(json.data);
    });
  };

  (0, _react.useEffect)(() => {
    if (newAddresses != null) {
      console.log("viiii", newAddresses);
      props.parentCallback(newAddresses);
    }
  }, [newAddresses]);
  (0, _react.useEffect)(() => {
    const styles = getComputedStyle(focusRef.current);
    let totalsize = Number(styles.width.slice(0, -2)) + Number(styles.paddingRight.slice(0, -2)) + Number(styles.paddingLeft.slice(0, -2));
    getWidth(totalsize.toString() + "px");
  }, []);

  const getWidth = width => {
    setWidth(width);
  };

  (0, _react.useEffect)(() => {
    if (props.searchval != '') {
      setValue(props.searchval);
      getPlacePredictions({
        input: props.searchval
      });
      setShowHideList(true);
      setA(props.searchval);
      focusRef.current.focus();
    }
  }, [props.searchval]);
  (0, _react.useEffect)(() => {
    setAddress(props.label || 'Company address');
  }, [props.label]);
  (0, _react.useEffect)(() => {
    if (testRef.current) {
      testRef.current.scrollIntoViewIfNeeded();
    }
  }, [cursor]);

  const handleClickOutside = e => {
    if (!clickRef.current.contains(e.target)) {
      setClickedOutside(true);
    }
  };

  const handleClickInside = e => {
    if (!clickRef.current.contains(e.target)) {
      setClickedOutside(true);
    }
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      setValue(placePredictions[cursor].description);
      getplace(placePredictions[cursor].place_id, props.apikey);
      setShowHideList(false);
    }

    if (e.keyCode === 9) {
      setValue(placePredictions[cursor].description);
      setShowHideList(false);
    }

    if (e.keyCode === 27) {
      setShowHideList(false);
    }

    if (e.keyCode === 38 && cursor > 0) {
      if (e.keyCode === 13) {}

      setCursor(cursor - 1, () => {});
    } else if (e.keyCode === 40 && cursor < placePredictions.length - 1) {
      setCursor(cursor + 1);
    }
  };

  const addresscom = place => {
    const address = place.address_components;
    const formattedAddress = place.formatted_address;
    const pincode = address.find(ele => ele.types.includes("postal_code"));
    const locality = address.find(ele => ele.types.includes("locality"));
    let city = address.find(ele => ele.types.includes("administrative_area_level_2"));
    const state = address.find(ele => ele.types.includes("administrative_area_level_1"));
    const country = address.find(ele => ele.types.includes("country"));
    city = locality ? locality : city;
    let line1 = '';
    let line2 = '';
    let line3 = '';
    const fullAddress = formattedAddress.split(',');
    fullAddress.pop();
    fullAddress.pop();
    fullAddress.pop();

    for (let i = 0; i < fullAddress.length; i++) {
      if (line1.length + fullAddress[i].length < props.limit) {
        if (line1 === '') line1 = `${fullAddress[i]}`;else line1 = `${line1},${fullAddress[i]}`;
      } else if (line2.length + fullAddress[i].length < props.limit) {
        if (line2 === '') line2 = `${fullAddress[i]}`;else line2 = `${line2},${fullAddress[i]}`;
      } else if (line3.length + fullAddress[i].length < props.limit) {
        if (line3 === '') line3 = `${fullAddress[i]}`;else line3 = `${line3},${fullAddress[i]}`;
      }
    }

    let addressParts = {};
    addressParts.line_one = line1;
    addressParts.line_two = line2;
    addressParts.line_three = line3;
    addressParts.city = city ? city.long_name : '';
    addressParts.state = state ? state.long_name : '';
    addressParts.pincode = pincode ? pincode.long_name : '';
    addressParts.country = country ? country.long_name : '';
    return addressParts;
  };

  const getplace = (place, apikey) => {
    fetch(`https://api.leptonsoftware.com:9962/lepton/getplace?placeid=${place}`).then(res => res.json()).then(json => {
      setNewAddresses({
        adressParts: addresscom(json.data),
        googleResponse: json.data
      });
    });
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    ref: clickRef,
    onClick: handleClickInside
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: props.labelclass ? props.labelclass : "lable-txt"
  }, address), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("input", {
    ref: focusRef,
    id: "address",
    style: {
      width: '352px',
      backgroundColor: '#f7f8f9'
    },
    className: props.class ? props.class : "inputAutocomplete",
    value: value,
    placeholder: props.placeholder ? props.placeholder : "",
    onKeyDown: e => handleKeyDown(e),
    onChange: evt => {
      getPlacePredictions({
        input: evt.target.value
      });
      setValue(evt.target.value);
      setShowHideList(true);
      setCursor(-1);
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: width
    }
  }, showHideList & !clickedOutside ? /*#__PURE__*/_react.default.createElement("div", {
    className: "wrapper-outer"
  }, /*#__PURE__*/_react.default.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0
    },
    className: "wrapper-ul"
  }, placePredictions.length > 0 && placePredictions.map((item, i) => /*#__PURE__*/_react.default.createElement("div", {
    key: i,
    className: cursor === i ? 'activeItem' : "inactive",
    ref: cursor == i ? testRef : inactiveTestRef
  }, /*#__PURE__*/_react.default.createElement("li", {
    className: "li-inner",
    key: i,
    style: {
      maxWidth: '100%',
      width: '100%'
    },
    onClick: e => {
      setValue(item.description);
      getplace(item.place_id, props.apikey);
      setShowHideList(false);
    }
  }, item.description))))) : null));
}

;

function Companyname(props) {
  const activeRef = (0, _react.useRef)();
  const testRef = (0, _react.useRef)();
  const clickRef = (0, _react.useRef)();
  const focusRef = (0, _react.useRef)();
  const inputTag = (0, _react.useRef)();
  const inactiveTestRef = (0, _react.useRef)();
  const [value, setValue] = (0, _react.useState)([]);
  const [showHideList, setShowHideList] = (0, _react.useState)(true);
  const [address, setAddress] = (0, _react.useState)("");
  const [a, setA] = (0, _react.useState)("");
  const [newAddresses, setNewAddresses] = (0, _react.useState)();
  const [cursor, setCursor] = (0, _react.useState)(-1);
  const [clickedOutside, setClickedOutside] = (0, _react.useState)(false);
  const [width, setWidth] = (0, _react.useState)(null);
  const [placePredictions, setPlacePredictions] = (0, _react.useState)([]);
  const [checker, setChecker] = (0, _react.useState)('');

  const getPlacePredictions = evt => {
    const value = evt.target.value;

    if (value > 2) {
      fetch(`https://api.leptonsoftware.com:9962/lepton/companyname?name=${value}`).then(res => res.json()).then(json => {
        if (evt.target.value == json.data.input) setPlacePredictions(json.data.name);
      });
    }
  };

  (0, _react.useEffect)(() => {
    if (newAddresses != null) {
      console.log("viiii", newAddresses);
      props.parentCallback(newAddresses);
    }
  }, [newAddresses]);
  (0, _react.useEffect)(() => {
    setAddress(props.label || 'Company Name');
  }, props.label);
  (0, _react.useEffect)(() => {
    if (testRef.current) {
      testRef.current.scrollIntoViewIfNeeded();
    }
  }, [cursor]);
  (0, _react.useEffect)(() => {
    if (value.length < 1) setPlacePredictions('');
  }, [value]);

  const handleClickOutside = e => {
    if (!clickRef.current.contains(e.target)) {
      setClickedOutside(true);
    }
  };

  const handleClickInside = e => {
    setClickedOutside(false);
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      console.log("13", placePredictions[cursor].company_name);
      setValue(placePredictions[cursor].company_name);
      props.parentCallback(placePredictions[cursor].company_name);
      setShowHideList(false);
    }

    if (e.keyCode === 9) {
      setValue(placePredictions[cursor].company_name);
      props.parentCallback(placePredictions[cursor].company_name);
      setShowHideList(false);
    }

    if (e.keyCode === 27) {
      setShowHideList(false);
    }

    if (e.keyCode === 38 && cursor > 0) {
      setCursor(cursor - 1);
      console.log("38", placePredictions[cursor].company_name);

      if (e.keyCode === 13) {}
    } else if (e.keyCode === 40 && cursor < placePredictions.length - 1) {
      setCursor(cursor + 1);
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    ref: clickRef,
    onClick: handleClickInside,
    onBlur: handleClickOutside
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: props.labelclass ? props.labelclass : "lable-txt"
  }, address), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("input", {
    ref: focusRef,
    id: "address",
    style: {
      width: '352px',
      backgroundColor: '#f7f8f9'
    },
    className: props.class ? props.class : "inputAutocomplete",
    value: value,
    placeholder: props.placeholder ? props.placeholder : "",
    onKeyDown: e => handleKeyDown(e),
    onChange: evt => {
      getPlacePredictions(evt);
      setValue(evt.target.value);
      setChecker(evt.target.value);
      setShowHideList(true);
      setCursor(-1);
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: width
    }
  }, showHideList & !clickedOutside ? /*#__PURE__*/_react.default.createElement("div", {
    className: "wrapper-outer"
  }, /*#__PURE__*/_react.default.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0
    },
    className: "wrapper-ul"
  }, placePredictions.length > 0 && placePredictions.map((item, i) => /*#__PURE__*/_react.default.createElement("div", {
    key: i,
    className: cursor === i ? 'activeItem' : "inactive",
    ref: cursor == i ? testRef : inactiveTestRef
  }, /*#__PURE__*/_react.default.createElement("li", {
    className: "li-inner",
    key: i,
    style: {
      maxWidth: '100%'
    },
    onClick: e => {
      setValue(item.company_name);
      props.parentCallback(item.company_name);
      setShowHideList(false);
    }
  }, item.company_name))))) : null));
}

;