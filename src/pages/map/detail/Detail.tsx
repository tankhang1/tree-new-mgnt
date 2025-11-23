import MapBox from "@/pages/crop/map/components/MapBox";

const DetailPage = () => {
  return (
    <div className="w-full">
      <MapBox h={850} area plot zone zoom={17} />
    </div>
  );
};
export default DetailPage;
