import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import styles from "../styles/SearchBar.module.css";

const SearchBar = () => {
  const history = useHistory();
  const [term, setTerm] = useState("");
  const handleClick = (query) =>
    history.push(`/results?query=${query}&type=images`);
  const onSubmit = (e) => {
    e.preventDefault();
    setTerm("");
    handleClick(term);
  };
  return (
    <form id={styles.searchBar} onSubmit={onSubmit}>
      <input
        type="text"
        id={styles.search}
        placeholder="Search For Content"
        autoComplete="off"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button class={styles.submit}>
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
