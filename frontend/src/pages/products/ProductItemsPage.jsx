import { Progress } from "flowbite-react";

const ProductItemsPage = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-2 bg-">
      <div>
        <div>Subcolumn</div>
        <div>Subcolumn</div>
      </div>
      <div>
        <h1>Denim Jacket</h1>
        <p>$100</p>
          <div>
          <Progress progress={45} />;
          </div>
      </div>
    </div>
  );
};

export default ProductItemsPage;
