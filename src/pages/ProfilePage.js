import React from 'react';
import NavigationBar from '../components/NavigationBar';

const LikedUserItemSimple = ({ user }) => (
    <div style={{ border: '1px solid #eee', padding: '10px', margin: '5px 0', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
        <img src={user.avatar_url} alt={user.login} style={{height: '40px', width: '40px',  borderRadius: '50%', marginRight: '10px'}} />
        <div>
            <strong><a href={user.html_url} target="_blank" rel="noopener noreferrer">{user.login}</a></strong> (ID: {user.id})<br />
            <small>Repos: {user.public_repos}, Followers: {user.followers}</small>
        </div>
    </div>
);

const ProfilePage = ({ loggedInPhoneNumber, userProfileData, onLogout, isLoadingProfile }) =>{
  
  if (isLoadingProfile || !userProfileData) {
    return (
        <>
            <NavigationBar onLogout={onLogout} />
            <div style={{padding: '20px', textAlign: 'center'}}>Đang tải hồ sơ...</div>
        </>
    );
  }

  const { phoneNumber, likedGithubUsers } = userProfileData;

  return (
    <div>
      <NavigationBar onLogout={onLogout} />
      <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
        <h2>Profile </h2>
        <p><strong>Phone number:</strong> {phoneNumber || loggedInPhoneNumber}</p>
        <h3>list github user liked:</h3>
        {likedGithubUsers && likedGithubUsers.length > 0 ? (
          likedGithubUsers.map(user => (
            <LikedUserItemSimple key={user.id} user={user} />
          ))
        ) : (
          <p>empty</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;