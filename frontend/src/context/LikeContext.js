import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth

// 1. Create the context
const LikeContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useLikes = () => {
  return useContext(LikeContext);
};

// 3. Create the Provider component
export const LikeProvider = ({ children }) => {
  const { isAuthenticated, user, token } = useAuth(); // Get auth state

  // State to hold liked properties, initialized from localStorage
  const [likedProperties, setLikedProperties] = useState(() => {
    try {
      const localData = localStorage.getItem('likedProperties');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Failed to parse liked properties from localStorage:", error);
      return [];
    }
  });

  // --- Persistence to localStorage ---
  useEffect(() => {
    try {
      localStorage.setItem('likedProperties', JSON.stringify(likedProperties));
    } catch (error) {
      console.error("Failed to save liked properties to localStorage:", error);
    }
  }, [likedProperties]); // Save whenever likedProperties changes

  // --- Backend Sync (Fetch on Login/Load) ---
  useEffect(() => {
    const fetchLikesFromBackend = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const response = await fetch(`http://localhost:5000/api/likes/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            // Assuming backend returns an array of full property objects or IDs
            // For now, let's assume it returns full property objects
            setLikedProperties(data.likes || []);
          } else {
            console.error("Failed to fetch likes from backend:", response.statusText);
            // Fallback to localStorage if backend fetch fails for logged-in user
            const localData = localStorage.getItem('likedProperties');
            setLikedProperties(localData ? JSON.parse(localData) : []);
          }
        } catch (error) {
          console.error("Error fetching likes from backend:", error);
          // Fallback to localStorage if network error
          const localData = localStorage.getItem('likedProperties');
          setLikedProperties(localData ? JSON.parse(localData) : []);
        }
      } else if (!isAuthenticated) {
        // If user logs out, clear in-memory likes and re-load from localStorage (which might be empty)
        const localData = localStorage.getItem('likedProperties');
        setLikedProperties(localData ? JSON.parse(localData) : []);
      }
    };
    fetchLikesFromBackend();
  }, [isAuthenticated, user?.id, token]); // Re-fetch when auth status or user changes

  /**
   * Adds a property to the liked list and syncs with backend if logged in.
   * @param {object} property - The full property object to add.
   */
  const likeProperty = async (property) => {
    // Optimistic UI update
    setLikedProperties(prevLiked => {
      if (prevLiked.find(p => p.id === property.id)) return prevLiked;
      return [...prevLiked, property];
    });

    if (isAuthenticated && user?.id) {
      try {
        const response = await fetch(`http://localhost:5000/api/likes/${user.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ property_id: property.id, property_data: property }), // Send property ID and data
        });
        if (!response.ok) {
          console.error("Failed to like property on backend:", response.statusText);
          // Revert optimistic update if API fails
          setLikedProperties(prevLiked => prevLiked.filter(p => p.id !== property.id));
        }
      } catch (error) {
        console.error("Error liking property on backend:", error);
        // Revert optimistic update if network error
        setLikedProperties(prevLiked => prevLiked.filter(p => p.id !== property.id));
      }
    }
  };

  /**
   * Removes a property from the liked list and syncs with backend if logged in.
   * @param {number} propertyId - The ID of the property to remove.
   */
  const unlikeProperty = async (propertyId) => {
    // Optimistic UI update
    setLikedProperties(prevLiked => prevLiked.filter(p => p.id !== propertyId));

    if (isAuthenticated && user?.id) {
      try {
        const response = await fetch(`http://localhost:5000/api/likes/${user.id}/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.error("Failed to unlike property on backend:", response.statusText);
          // Revert optimistic update if API fails
          setLikedProperties(prevLiked => {
            const propertyToRevert = likedProperties.find(p => p.id === propertyId);
            return propertyToRevert ? [...prevLiked, propertyToRevert] : prevLiked;
          });
        }
      } catch (error) {
        console.error("Error unliking property on backend:", error);
        // Revert optimistic update if network error
        setLikedProperties(prevLiked => {
            const propertyToRevert = likedProperties.find(p => p.id === propertyId);
            return propertyToRevert ? [...prevLiked, propertyToRevert] : prevLiked;
          });
      }
    }
  };

  /**
   * Checks if a property is already liked.
   * @param {number} propertyId - The ID of the property to check.
   * @returns {boolean} - True if the property is liked, false otherwise.
   */
  const isLiked = (propertyId) => {
    return likedProperties.some(p => p.id === propertyId);
  };

  const value = {
    likedProperties,
    likeProperty,
    unlikeProperty,
    isLiked,
    likeCount: likedProperties.length,
  };

  return (
    <LikeContext.Provider value={value}>
      {children}
    </LikeContext.Provider>
  );
};