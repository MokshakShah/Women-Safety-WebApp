import React from 'react';
import EmergencyContacts from '../components/EmergencyContacts';
import SOSButton from '../components/SOSButton';
import LocationMap from '../components/LocationMap';
import SelfDefenseVideos from '../components/SelfDefenseVideos';
import PhotoUpload from '../components/PhotoUpload';
import FamilyContacts from '../components/FamilyContacts';
import BoxCard from '../components/BoxCard';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <BoxCard title="Emergency Contacts" content={<EmergencyContacts />} />
      <BoxCard title="SOS Button" content={<SOSButton />} />
      <BoxCard title="Location" content={<LocationMap />} />
      <BoxCard title="Self-Defense Videos" content={<SelfDefenseVideos />} />
      <BoxCard title = "Photo Upload" content = {<PhotoUpload />} />
      <BoxCard title = "Family Contacts" content = {<FamilyContacts />} />
    </div>
  );
}

export default Home;
