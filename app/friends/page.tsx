"use client";

import { faUserFriends, faSpinner, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Friend {
  friendEmail: string;
  friendName: string | null;
  since: string;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      if (!response.ok) throw new Error('Failed to fetch friends');
      const data = await response.json();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (email: string) => {
    setRemovingEmail(email);
    try {
      const response = await fetch(`/api/friends/${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove friend');
      
      // Remove friend from the list
      setFriends(prev => prev.filter(friend => friend.friendEmail !== email));
    } catch (err) {
      console.error('Error removing friend:', err);
      setError('Failed to remove friend');
    } finally {
      setRemovingEmail(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchFriends();
          }}
          className="text-blue-500 hover:text-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Friends</h1>
        <Link
          href="/friends/requests"
          className="text-blue-500 hover:text-blue-600"
        >
          View Friend Requests
        </Link>
      </div>

      {friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FontAwesomeIcon icon={faUserFriends} className="text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Friends Yet</h2>
          <p className="text-gray-500">Start adding friends to see them here!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <div
              key={friend.friendEmail}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {friend.friendName || friend.friendEmail}
                  </h3>
                  {friend.friendName && (
                    <p className="text-sm text-gray-500">{friend.friendEmail}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Friends since {new Date(friend.since).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeFriend(friend.friendEmail)}
                  disabled={removingEmail === friend.friendEmail}
                  className="text-gray-500 hover:text-red-500 transition-colors p-2"
                  title="Remove friend"
                >
                  {removingEmail === friend.friendEmail ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faUserMinus} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
