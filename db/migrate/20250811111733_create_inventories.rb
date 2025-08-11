class CreateInventories < ActiveRecord::Migration[8.0]
  def change
    create_table :inventories do |t|
      t.string :name
      t.integer :quantity
      t.decimal :price

      t.timestamps
    end
  end
end
