// import React from "react";
// import PropTypes from "prop-types";

// const MovieHeaders = ({
//     searchTerm,
//     sortOrder,
//     onSearchTermChange,
//     onSortOrderChange,
//     onSearchSubmit,
// }) => {
//     return (
//         <div>
//             {/* Search form */}
//             <form onSubmit={onSearchSubmit} className="mb-4">
//                 <div className="flex items-center">
//                     <input
//                         type="text"
//                         placeholder="Rechercher une série"
//                         className="border border-gray-300 rounded px-2 py-1 flex-grow"
//                         value={searchTerm}
//                         onChange={onSearchTermChange}
//                     />
//                     <button
//                         type="submit"
//                         className="bg-blue-500 text-white rounded px-2 py-1 ml-2"
//                     >
//                         Rechercher
//                     </button>
//                 </div>
//             </form>

//             {/* Sort options */}
//             <div className="flex justify-end mt-4">
//                 <label className="mr-2">Trier par :</label>
//                 <select
//                     className="border border-gray-300 rounded px-2 py-1"
//                     onChange={(e) => onSortOrderChange(e.target.value)}
//                     value={sortOrder}
//                 >
//                     <option value="popularity">Popularité</option>
//                     <option value="title_asc">Titre (A à Z)</option>
//                     <option value="title_desc">Titre (Z à A)</option>
//                 </select>
//             </div>
//         </div>
//     );
// };

// MovieHeaders.propTypes = {
//     searchTerm: PropTypes.string,
//     sortOrder: PropTypes.string,
//     onSearchTermChange: PropTypes.func,
//     onSortOrderChange: PropTypes.func,
//     onSearchSubmit: PropTypes.func,
// };

// export default MovieHeaders;
