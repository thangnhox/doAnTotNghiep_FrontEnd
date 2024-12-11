import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./reduxStore";
import Book from "../models/book/Book";

export interface CartState {
  open: boolean;
  books: Book[];
  discountId?: number | null;
  total: number;
}

const initialCartState: CartState = {
  open: false,
  books: [],
  discountId: null,
  total: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: initialCartState,
  },
  reducers: {
    AddBookToCart: (state, action) => {
      if (state.data.books.some((val) => val.BookID === action.payload.BookID))
        return;
      const newBooksArray = [...state.data.books, action.payload];
      state.data = {
        ...state.data,
        books: newBooksArray,
        total: getTotalPrice(newBooksArray),
      };
    },
    RemoveBookFromCart: (state, action) => {
      const newBooksArray = state.data.books.filter(
        (item) => item.BookID !== action.payload.BookID
      );
      state.data = {
        ...state.data,
        books: newBooksArray,
        total: getTotalPrice(newBooksArray),
      };
    },
    AddDiscountIdToCart: (state, action) => {
      state.data = {
        ...state.data,
        discountId: action.payload,
      };
    },

    RemoveDiscountIdToCart: (state) => {
      state.data = {
        ...state.data,
        discountId: null,
      };
    },

    ClearCart: (state) => {
      state.data = initialCartState;
    },

    ChangeOpenCloseCart: (state, action) => {
      state.data = {
        ...state.data,
        open: action.payload,
      };
    },
  },
});

const getTotalPrice = (list: Book[]): number => {
  if (list.length === 0) return 0;
  let total = 0;
  list.forEach((val) => (total += Number(val.Price)));
  return total;
};

export const {
  AddBookToCart,
  AddDiscountIdToCart,
  RemoveBookFromCart,
  RemoveDiscountIdToCart,
  ClearCart,
  ChangeOpenCloseCart,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
export const cartState = (state: RootState) => state.cart.data;
