class AddPaidStatusToBills < ActiveRecord::Migration
  def change
    add_column :bills, :paid_status, :boolean, :default => FALSE
  end
end
