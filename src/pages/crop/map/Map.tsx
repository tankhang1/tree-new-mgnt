import MapBox from "./components/MapBox";

const MapPage = () => {
  return (
    <div className="w-full">
      <MapBox h={850} area plot zone zoom={17} />
    </div>
  );
};
export default MapPage;
