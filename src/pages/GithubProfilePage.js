import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../App';
import NavigationBar from '../components/NavigationBar';
import UserCard from '../components/UserCard'; 

function GithubProfilePage({ onLogout, phoneNumber }) {
  const { githubId } = useParams(); 
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    
    if (!githubId) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/user/find-github-user-profile/`, {
          params: { github_user_id: githubId, phoneNumber: phoneNumber}
        });
        setProfile(response.data);
        setIsLiked(response.data.isLiked); 
      } catch (err) {
        setError(err.response?.data?.error || 'Không thể tải thông tin hồ sơ.');
        console.error("Error fetching github profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [githubId, isLiked]);



  const handleLikeGithubUser = async (githubUserToToggle) => {
    if (!phoneNumber) return;
    try {
      await axios.post(`${API_BASE_URL}/user/like-github-user`, {
        phoneNumber: phoneNumber,
        githubId: `${githubUserToToggle.id}`,
      });
      setIsLiked(!isLiked);
      
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi khi thích/bỏ thích hồ sơ.");
    }
  };


  return (
    <div>
      <NavigationBar onLogout={onLogout} />
      <div style={{ padding: '20px' }}>
        <Link to="/search"> turn back</Link>
        <div style={{ marginTop: '20px' }}>
            <UserCard
            user={profile}
              isLiked={profile?.isLiked}
              onLikeToggle={() => handleLikeGithubUser(profile)}
             />
            </div>
      </div>
    </div>
  );
}

export default GithubProfilePage;