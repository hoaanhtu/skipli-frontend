import React, { useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../App";
import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";

function SearchPage({ userProfileData, onLogout, isLoadingProfile }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearch, setCurrentSearch] = useState(""); // Để giữ lại term khi phân trang
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Giả định bạn quản lý kết quả tìm kiếm ở đây
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalGithubResults, setTotalGithubResults] = useState(0);

  // console.log("likedUsersIds:", userProfileData);

  const handleSearchAPICall = useCallback(async (term, page, perPage) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchError("");
      setTotalGithubResults(0);
      return;
    }
    setIsSearching(true);
    setSearchError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/search-github-user-profile`,
        {
          params: { q: term, page, per_page: perPage },
        }
      );
      setSearchResults(response.data.items || response.data || []);
      setTotalGithubResults(
        response.data.total_count > 1000 ? 1000 : response.data.total_count || 0
      );
      setCurrentPage(page);
      setCurrentSearch(term); // Lưu lại search term hiện tại
    } catch (err) {
      setSearchError(
        err.response?.data?.error || "Lỗi khi tìm kiếm người dùng GitHub."
      );
      setSearchResults([]);
      setTotalGithubResults(0);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    handleSearchAPICall(searchTerm, 1, resultsPerPage);
  };

  const handlePageChange = (newPage) => {
    handleSearchAPICall(currentSearch, newPage, resultsPerPage);
  };

  const handleResultsPerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value, 10);
    setResultsPerPage(newPerPage);
    handleSearchAPICall(currentSearch, 1, newPerPage);
  };

  const totalPages = Math.ceil(totalGithubResults / resultsPerPage);

  if (isLoadingProfile && !userProfileData) {
    return (
      <>
        <NavigationBar onLogout={onLogout} />
        <div style={{ padding: "20px", textAlign: "center" }}>
          Đang tải thông tin người dùng...
        </div>
      </>
    );
  }

  const handleClickGithubUser = (user) => {
    window.location.href = `/github-profile/${user.id}`;
  };

  return (
    <div>
      <NavigationBar onLogout={onLogout} />
      <div style={{ padding: "20px" }}>
        <h2>Search github user </h2>
        <form
          onSubmit={handleSearchFormSubmit}
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter username GitHub..."
            style={{
              padding: "10px",
              fontSize: "16px",
              marginRight: "10px",
              flexGrow: 1,
            }}
          />
          <button
            type="submit"
            style={{ padding: "10px 15px" }}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {searchError && <p style={{ color: "red" }}>{searchError}</p>}

        {searchResults.length > 0 && (
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label htmlFor="resultsPerPage">result/page: </label>
              <select
                id="resultsPerPage"
                value={resultsPerPage}
                onChange={handleResultsPerPageChange}
                disabled={isSearching}
              >
                {[5, 10, 20, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {totalPages > 1 &&
                Array.from(
                  { length: Math.min(totalPages, 7) },
                  (_, i) => i + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isSearching || currentPage === pageNumber}
                    style={{
                      margin: "0 5px",
                      fontWeight:
                        currentPage === pageNumber ? "bold" : "normal",
                    }}
                  >
                    {pageNumber}
                  </button>
                ))}
              {totalPages > 7 && (
                <span>
                  ... Page {currentPage}/{totalPages}
                </span>
              )}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          {searchResults.map((user) => (
            // <UserCard
            //   key={user.id}
            //   user={user}
            //   isLiked={likedUsersIds.includes(user.id)}
            //   onLikeToggle={() => handleLikeGithubUser(user)}
            // />
            <div
              onClick={() => handleClickGithubUser(user)}
              key={user.id}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                marginBottom: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                width: "320px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginBottom: "4px",
                }}
              >
                {user.login}
              </div>
              <div style={{ color: "#555" }}>ID: {user.id}</div>
            </div>
          ))}
        </div>
        {searchResults.length === 0 && currentSearch && !isSearching && (
          <p>No result for "{currentSearch}".</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
