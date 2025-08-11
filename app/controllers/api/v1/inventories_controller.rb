module Api
  module V1
    class InventoriesController < ApplicationController
      before_action :set_inventory, only: [:show, :update, :destroy]

      def index
        inventories = Inventory.all
        render json: inventories
      end

      def show
        render json: @inventory
      end

      def create
        inventory = Inventory.new(inventory_params)
        if inventory.save
          render json: inventory, status: :created
        else
          render json: inventory.errors, status: :unprocessable_entity
        end
      end

      def update
        if @inventory.update(inventory_params)
          render json: @inventory
        else
          render json: @inventory.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @inventory.destroy
        head :no_content
      end

      private
      def set_inventory
        @inventory = Inventory.find(params[:id])
      end

      def inventory_params
        params.require(:inventory).permit(:name, :quantity, :price)
      end
    end
  end
end
