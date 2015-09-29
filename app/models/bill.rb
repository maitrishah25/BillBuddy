class Bill < ActiveRecord::Base
  belongs_to :user

  validates_presence_of :name, :due_date, :amount

end
