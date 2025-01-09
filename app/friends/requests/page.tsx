"use client";

import { faUserPlus, faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Link from "next/link";

interface FriendRequest {
  id: number;
  fromUser: {
    email: string;
    name: string | null;
  };
  createdAt: string;
}

export default function FriendRequestsPage() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching friend requests:', err);
      setError('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: number, action: 'accept' | 'ignore') => {
    setProcessingIds(prev => new Set(prev).add(requestId));
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (!response.ok) throw new Error('Failed to process request');
      
      // Remove the processed request from the list
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Error processing friend request:', err);
      setError('Failed to process request');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
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
            fetchRequests();
          }}
          className="text-blue-500 hover:text-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faUserPlus} className="text-4xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Friend Requests</h2>
        <p className="text-gray-500">You don't have any pending friend requests</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">
                {request.fromUser.name || request.fromUser.email}
              </h3>
              {request.fromUser.name && (
                <p className="text-sm text-gray-500">{request.fromUser.email}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleRequest(request.id, 'accept')}
                disabled={processingIds.has(request.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {processingIds.has(request.id) ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faCheck} />
                )}
              </button>
              <button
                onClick={() => handleRequest(request.id, 'ignore')}
                disabled={processingIds.has(request.id)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              >
                {processingIds.has(request.id) ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faTimes} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
