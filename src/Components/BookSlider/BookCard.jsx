/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import BookOverlay from "./BookOverlay";

const BookCard = ({ book }) => (
  <div className="flex flex-col group relative">
    <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
      <img
        src={book.thumbnail}
        alt={book.name}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
      <span className={`absolute top-3 right-3 ${book.price === 0 ? 'bg-emerald-500' : 'bg-red-500'} text-white px-4 py-2 rounded-md text-sm font-bold`}>
        {book?.price === 0 ? "Miễn phí" : book?.price?.toLocaleString("vi-VN") + "₫"}
      </span>

      <BookOverlay book={book} />
    </div>
    <h3 className="mt-3 text-sm md:text-base font-medium text-white line-clamp-2 group-hover:text-[#18B088] transition-colors">
      {book.name}
    </h3>
  </div>
);

export default BookCard;
