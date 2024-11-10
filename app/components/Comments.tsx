// for client side rendering
"use client";

// import icons from FontAwesome
import {faHeart, faCalendar} from "@fortawesome/free-regular-svg-icons";
import {faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"; // for post button
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// import React hooks (manages the local state of our components, such as # of likes)
import {useState} from "react";

// Redux hooks for state management
// useDispatch can be used to update the state when an event is liked
import {useDispatch, useSelector} from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";

// import redux actions
import {likeEvent} from "../redux/searchSlice";

// importing a function, atcb_action: handles the action when calendar button is clicked
import {atcb_action} from "add-to-calendar-button";