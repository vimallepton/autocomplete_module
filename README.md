# autocomplete_module

 Features#
○Autocomplete.
○All Registered Company names.
○Get Company Locations.
○Access to lepton data API.

Environment Support#
○Modern browsers and Internet Explorer 11 (with polyfills)
○Server-side Rendering
○Electron

IE / Edge	
Firefox	
Chrome	
Safari	
Opera	
Electron
IE11, Edge	last 2 versions	last 2 versions	last 2 versions	last 2 versions	last 2 versions



Version#
○Stable: v17.0.2


Installation#
Using npm or yarn#
We recommend using npm or yarn to install, 
$ npm install 
$ yarn install
If you are in a bad network environment, you can try other registries and tools like cnpm.
Dependencies #
1.Node
2.Material UI : npm i @material-ui/coreAxios: npm install axios
3.React Google Auto complete : npm i react-google-autocomplete
4.Js and css file must be in same folder.
Usage #

import  Companyname, Addressinput  from 'enter file location';
import React, { useState,useEffect, useRef, useCallback } from 'react';

const [locality, setLocality] = useState('');
 
return (
<>
<Companyname parentCallback={(e)=>{setLocality(e);}}></Companyname>

<Addressinput  apikey=”<google_api>” searchval={locality}>  </Addressinput>
</>)

  









Props #

Prop	Default Value	Description
minWidth		Minimum with of the input box
backgroundColor		Background color of the input box
borderWidth		Border width of the input box
Border Color		Border color of the input box
Border radius		Border radius of the input box
Font Family		Font family used
		
