"use client";

import { faUserPlus, faUserCheck, faSpinner, faUserClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

interface FriendButtonProps {
  userEmail: string;
  className?: string;
}

type FriendshipStatus = 'none' | 'pending' | 'friends';

export default function FriendButton({ userEmail, className = "" }: FriendButtonProps) {
  const [status, setStatus] = useState<FriendshipStatus>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFriendshipStatus();
  }, [userEmail]);

  const fetchFriendshipStatus = async () => {
    try {
      const response = await fetch(`/api/friends/${encodeURIComponent(userEmail)}`);
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data.status);
    } catch (err) {
      console.error('Error fetching friendship status:', err);
      setError('Failed to load status');
    }
  };

  const sendFriendRequest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/friends/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: userEmail })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send request');
      }

      setStatus('pending');
    } catch (err) {
      console.error('Error sending friend request:', err);
      setError(err instanceof Error ? err.message : 'Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/friends/${encodeURIComponent(userEmail)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove friend');
      }

      setStatus('none');
    } catch (err) {
      console.error('Error removing friend:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove friend');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <button
        className={`inline-flex items-center px-4 py-2 rounded-md bg-gray-200 text-gray-700 ${className}`}
        disabled
      >
        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
        Loading...
      </button>
    );
  }

  if (status === 'friends') {
    return (
      <button
        onClick={removeFriend}
        className={`inline-flex items-center px-4 py-2 rounded-md bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 transition-colors ${className}`}
        title="Click to remove friend"
      >
        <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
        Friends
      </button>
    );
  }

  if (status === 'pending') {
    return (
      <button
        className={`inline-flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-700 cursor-default ${className}`}
        disabled
      >
        <FontAwesomeIcon icon={faUserClock} className="mr-2" />
        Request Pending
      </button>
    );
  }

  return (
    <button
      onClick={sendFriendRequest}
      className={`inline-flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ${className}`}
    >
      <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
      Add Friend
    </button>
  );
}
