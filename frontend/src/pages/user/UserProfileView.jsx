import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {userApi} from '../../utils/api';
import {ArrowLeft, Calendar, Loader2, Shield, Tag, User} from 'lucide-react';
import ExpProgressBar from '../../components/ExpProgressBar';

const UserProfileView = () => {
    const {id} = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.get(id);
                setUserProfile(data);
            } catch (err) {
                setError('User not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary"/>
        </div>
    );

    if (error || !userProfile) return (
        <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">{error || 'User not found'}</h2>
            <Link to="/users" className="text-primary mt-4 inline-block">Back to users</Link>
        </div>
    );

    return (
        <main className="max-w-4xl mx-auto p-4">
            <nav className="mb-6">
                <Link to="/users"
                      className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4"/>
                    Back to Users
                </Link>
            </nav>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <header className="h-24 bg-gray-50 flex items-center px-8 border-b">
                    <div
                        className="w-20 h-20 rounded-lg bg-white shadow-sm flex items-center justify-center border-2 border-gray-200 translate-y-8 overflow-hidden">
                        {userProfile.image ? (
                            <img src={userProfile.image} alt="" className="w-full h-full object-cover"/>
                        ) : (
                            <User className="w-10 h-10 text-gray-400"/>
                        )}
                    </div>
                </header>

                <div className="pt-12 px-8 pb-8">
                    <section className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-8 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{userProfile.username}</h1>
                            <p className="text-gray-500">@{userProfile.username}</p>
                        </div>
                        <div className="w-full md:w-64">
                            <ExpProgressBar user={userProfile} isCurrentUser={false}/>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <Calendar className="w-5 h-5 text-gray-400"/>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Birth
                                    Date</p>
                                <p className="text-gray-900 font-medium">{userProfile.birthDate || 'Not specified'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <Tag className="w-5 h-5 text-gray-400"/>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Member
                                    Type</p>
                                <p className="text-gray-900 font-medium">{userProfile.memberType}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <Shield className="w-5 h-5 text-gray-400"/>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Gender</p>
                                <p className="text-gray-900 font-medium">{userProfile.gender || 'Not specified'}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default UserProfileView;
