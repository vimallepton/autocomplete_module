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
  const outsideRef = (0, _react.useRef)(); //starts

  const showHideRef = (0, _react.useRef)(null);
  const testRef = (0, _react.useRef)();
  const clickRef = (0, _react.useRef)();
  const focusRef = (0, _react.useRef)();
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
  const [clickInput, setClickInput] = (0, _react.useState)(false);

  const getPlacePredictions = data => {
    fetch(`https://api.leptonsoftware.com:9962/lepton/getplacepredication?input=${data.input}`).then(res => res.json()).then(json => {
      setPlacePredictions(json.data);
    });
  };

  (0, _react.useEffect)(() => {
    if (newAddresses != null) {
      props.parentCallback(newAddresses);
    }
  }, [newAddresses]);
  (0, _react.useEffect)(() => {
    const checkIfClickedOutside = e => {
      if (showHideList && showHideRef.current && !showHideRef.current.contains(e.target)) {
        setShowHideList(false);
        setClickInput(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showHideList]); //// CHANGE STARTS here

  (0, _react.useEffect)(() => {
    const styles = getComputedStyle(focusRef.current);
    let totalsize = Number(styles.width.slice(0, -2)) + Number(styles.paddingRight.slice(0, -2)) + Number(styles.paddingLeft.slice(0, -2));
    getWidth(totalsize.toString() + "px");
  }, []);

  const getWidth = width => {
    setWidth(width);
  };

  (0, _react.useEffect)(() => {
    if (props.searchval != '' && clickInput === true) {
      //setValue(props.searchval);
      getPlacePredictions({
        input: props.searchval
      });
      setShowHideList(true);
      setA(props.searchval);
      setValue("");
      setCursor(-1);
    }
  }, [props.searchval, clickInput]);
  (0, _react.useEffect)(() => {
    setValue("");
  }, [props.companyNameInputTrack]);
  (0, _react.useEffect)(() => {
    setAddress(props.label || 'Company address');
  }, [props.label]);
  (0, _react.useEffect)(() => {
    if (testRef.current) {
      testRef.current.scrollIntoViewIfNeeded();
    }
  }, [cursor]);

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      if (value && cursor == -1) {
        setShowHideList(false);
      } else {
        if (placePredictions.length > 0 && cursor !== -1) {
          setValue(placePredictions[cursor].description);
          getplace(placePredictions[cursor].place_id);
          setCursor(-1);
        }

        setShowHideList(false);
      }
    }

    if (e.keyCode === 9) {
      if (!value || value.length === 0) {
        setShowHideList(false);

        if (placePredictions.length > 0 && cursor !== -1) {
          setValue(placePredictions[cursor].description);
          getplace(placePredictions[cursor].place_id);
          setCursor(-1);
        }
      } else if (value && cursor == -1) {
        setShowHideList(false);
      } else {
        setValue(placePredictions[cursor].description);
        getplace(placePredictions[cursor].place_id);
        setShowHideList(false);
      }
    }

    if (e.keyCode === 27) {
      setShowHideList(false);
    }

    if (e.keyCode === 38 && cursor > 0) {
      setCursor(cursor - 1);
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
    let fullAddress = formattedAddress.split(',');
    fullAddress = fullAddress.slice(0, fullAddress.length - 3);
    let a = true;
    let b = true;

    for (let i = 0; i < fullAddress.length; i++) {
      if (line1.length + fullAddress[i].length < props.limit && a) {
        if (line1 === '') line1 = `${fullAddress[i]}`;else line1 = `${line1},${fullAddress[i]}`;
      } else if (line2.length + fullAddress[i].length < props.limit && b) {
        a = false;
        if (line2 === '') line2 = `${fullAddress[i]}`;else line2 = `${line2},${fullAddress[i]}`;
      } else if (line3.length + fullAddress[i].length) {
        a = false;
        b = false;
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
    setValue(line1);
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
    ref: showHideRef
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: props.labelclass ? props.labelclass : "lable-txt"
  }, address), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("input", {
    onClick: () => {
      props.setShowDropdownSetter(true);
      setClickInput(true);
    },
    onFocus: () => {
      props.setShowDropdownSetter(true);
      setClickInput(true);
    } // onClick={()=>{setClickInput(true)}}
    ,
    ref: focusRef,
    id: "address",
    style: {
      width: '352px',
      backgroundColor: '#f7f8f9',
      maxHeight: props.maxheight ? props.maxheight : 'auto'
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
  }, showHideList ? /*#__PURE__*/_react.default.createElement("div", {
    className: "wrapper-outer"
  }, /*#__PURE__*/_react.default.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0
    },
    className: "wrapper-ul"
  }, showHideList && props.showDropdown && placePredictions.length > 0 && placePredictions.map((item, i) => /*#__PURE__*/_react.default.createElement("div", {
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
  const showHideRef = (0, _react.useRef)();
  const testRef = (0, _react.useRef)();
  const clickRef = (0, _react.useRef)();
  const focusRef = (0, _react.useRef)();
  const inactiveTestRef = (0, _react.useRef)();
  const [value, setValue] = (0, _react.useState)('');
  const [showHideList, setShowHideList] = (0, _react.useState)(true);
  const [address, setAddress] = (0, _react.useState)(""); // const [newAddresses, setNewAddresses] = useState(); 

  const [cursor, setCursor] = (0, _react.useState)(-1); // const [clickedOutside, setClickedOutside] = useState(false); 

  const [width, setWidth] = (0, _react.useState)(null); //This will be used 

  const [placePredictions, setPlacePredictions] = (0, _react.useState)([]);
  (0, _react.useEffect)(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (showHideList && showHideRef.current && !showHideRef.current.contains(e.target)) {
        setShowHideList(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showHideList]);

  const getPlacePredictions = data => {
    if (data.input.length > 2) {
      fetch(`https://api.leptonsoftware.com:9962/lepton/companyname?name=${data.input}`).then(res => res.json()).then(json => {
        setPlacePredictions(json.data.name);
      });
    }
  }; // useEffect(() => { if (newAddresses != null) {  props.parentCallback(newAddresses); } }, [newAddresses]);


  (0, _react.useEffect)(() => {
    setAddress(props.label || 'Company Name');
  }, [props.label]);
  (0, _react.useEffect)(() => {
    if (testRef.current) {
      testRef.current.scrollIntoViewIfNeeded();
    }
  }, [cursor]);
  (0, _react.useEffect)(() => {
    if (value.length < 1) setPlacePredictions('');
  }, [value]); // const handleClickOutside = e => { if (!clickRef.current.contains(e.target)) { setClickedOutside(true); } };
  // const handleClickInside = (e) => { setClickedOutside(false); };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      if (!value || value.length === 0) {
        setShowHideList(false);
      } else if (value && cursor == -1) {
        setShowHideList(false);
      } else {
        setValue(placePredictions[cursor].company_name);
        props.parentCallback(placePredictions[cursor].company_name);
        setShowHideList(false);
      }
    }

    if (e.keyCode === 9) {
      if (!value && cursor == -1) {
        setShowHideList(false);
      } else if (value.length === 0) {
        setShowHideList(false);
      } else if (value && cursor == -1) {
        setShowHideList(false);
      } else {
        setValue(placePredictions[cursor].company_name);
        props.parentCallback(placePredictions[cursor].company_name);
        setShowHideList(false);
      }
    }

    if (e.keyCode === 27) {
      setShowHideList(false);
    }

    if (e.keyCode === 38 && cursor > 0) {
      setCursor(cursor - 1);

      if (e.keyCode === 13) {}
    } else if (e.keyCode === 40 && cursor < placePredictions.length - 1) {
      setCursor(cursor + 1);
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    ref: showHideRef
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: props.labelclass ? props.labelclass : "lable-txt"
  }, address), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("input", {
    ref: focusRef,
    id: "companyname",
    style: {
      maxHeight: props.maxheight ? props.maxheight : 'auto',
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
      props.companyNameInputSetter(evt.target.value);
      setCursor(-1);
      props.setShowDropdownSetter(false);
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: width
    }
  }, showHideList ? /*#__PURE__*/_react.default.createElement("div", {
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
