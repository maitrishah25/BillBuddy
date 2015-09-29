class CreateBills < ActiveRecord::Migration
  def change
    create_table :bills do |t|
      t.string :name
      t.string :due_date
      t.decimal :amount

      t.timestamps null: false
    end
  end
end
